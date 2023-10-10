import Home from '@/app/page';
import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

describe('Home Page', () => {
  it('Should render a link to expenses when user is logged in', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { username: 'test-user' },
    });
    render(<Home />);

    const myElement = screen.getByRole('button', { name: 'Expenses' });
    expect(myElement).toBeInTheDocument();
  });

  it('Should render a link to sign-up when user is not logged in', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
    });
    render(<Home />);

    const myElement = screen.getByRole('button', { name: 'Sign Up Now' });
    expect(myElement).toBeInTheDocument();
  });
});
