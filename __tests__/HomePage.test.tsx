import { render, screen } from '@testing-library/react';
import HomePage from '@/src/app/page';
import '@testing-library/jest-dom';

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', {
      name: /Jun.AI OmniKey Console/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
