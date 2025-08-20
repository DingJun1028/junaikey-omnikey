# main.py
import os
import requests
import google.generativeai as genai
from flask import Flask, request, jsonify

app = Flask(__name__)

# 從環境變數讀取 API 金鑰 (請確保在部署環境中已設定)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
CAPACITIES_API_KEY = os.environ.get("CAPACITIES_API_KEY")

# Capacities API 的基礎 URL
# 注意：官方 API 可能仍在變動，請以最終文件為準
CAPACITIES_API_BASE_URL = "https://api.capacities.io/v1/objects/"

# 設定 Gemini 模型
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")

@app.route("/gemini-webhook", methods=["POST"])
def handle_webhook():
    """
    接收來自 Capacities 的 Webhook，觸發 Gemini，並將結果寫回。
    """
    webhook_data = request.json
    
    # 1. 根據你定義的 Payload 格式，精準提取資訊
    event_type = webhook_data.get("event")
    object_id = webhook_data.get("objectId")
    properties = webhook_data.get("properties", {})
    prompt_text = properties.get("Prompt")

    # 簡單驗證，確保是我們需要的事件和資料
    if event_type not in ["object.updated", "object.created"] or not object_id or not prompt_text:
        print(f"Skipping request: Invalid payload. Event: {event_type}, ObjectID: {object_id}")
        return jsonify({"status": "skipped", "reason": "Invalid payload"}), 200

    # 避免無限循環：如果 Response 已經有內容，可能就不再觸發
    if properties.get("Response"):
        print(f"Skipping request: Response already exists for ObjectID: {object_id}")
        return jsonify({"status": "skipped", "reason": "Response already exists"}), 200

    print(f"Processing ObjectID: {object_id} with prompt: '{prompt_text[:50]}...'")

    # 2. 呼叫 Gemini API
    try:
        response = model.generate_content(prompt_text)
        gemini_response_text = response.text
    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        return jsonify({"error": f"Gemini API error: {str(e)}"}), 500

    # 3. 使用 Capacities REST API 將結果寫回
    update_url = f"{CAPACITIES_API_BASE_URL}{object_id}"
    headers = {
        "Authorization": f"Bearer {CAPACITIES_API_KEY}",
        "Content-Type": "application/json"
    }
    # 根據你的定義，建立回寫的 Payload
    payload = {
        "properties": {
            "Response": gemini_response_text
        }
    }

    try:
        print(f"Updating Capacities for ObjectID: {object_id}")
        update_response = requests.patch(update_url, json=payload, headers=headers)
        update_response.raise_for_status()  # 確保請求成功
    except requests.exceptions.RequestException as e:
        print(f"Error updating Capacities: {str(e)}")
        return jsonify({"error": f"Failed to update Capacities: {str(e)}"}), 500

    print(f"Successfully processed and updated ObjectID: {object_id}")
    return jsonify({"success": True}), 200

if __name__ == "__main__":
    # 用於本地測試，你可以用 curl 或其他工具向 http://127.0.0.1:8080/gemini-webhook 發送請求
    app.run(debug=True, port=8080)
