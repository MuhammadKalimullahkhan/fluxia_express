import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../src/client/Pages/Home';

// Mock @inertiajs/react
jest.mock('@inertiajs/react', () => ({
  Head: ({ title }: { title: string }) => <title>{title}</title>,
  usePage: () => ({
    component: 'home',
    props: {},
    url: '/home',
    version: '1.0',
  }),
}));

describe('Home Component', () => {
  it('should render the component with name prop', () => {
    render(<Home name="Test User" />);
    
    expect(screen.getByText(/Welcome to Inertia.js \+ React \+ Express!/i)).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/Name prop from server:/i)).toBeInTheDocument();
  });

  it('should display success message when provided', () => {
    render(<Home name="Test User" success={['User created successfully']} />);
    
    expect(screen.getByText(/User created successfully/i)).toBeInTheDocument();
    expect(screen.getByText(/Success:/i)).toBeInTheDocument();
  });

  it('should not display success message when not provided', () => {
    render(<Home name="Test User" />);
    
    expect(screen.queryByText(/Success:/i)).not.toBeInTheDocument();
  });

  it('should render the Head component with correct title', () => {
    render(<Home name="Test User" />);
    
    // Head component is mocked to render a <title> element
    expect(document.querySelector('title')).toHaveTextContent('Home');
  });

  it('should render count and increment button', () => {
    render(<Home name="Test User" />);
    
    expect(screen.getByText(/Count: 0/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /increment/i })).toBeInTheDocument();
  });

  it('should increment count when button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<Home name="Test User" />);
    
    const button = screen.getByRole('button', { name: /increment/i });
    await user.click(button);
    
    expect(screen.getByText(/Count: 1/i)).toBeInTheDocument();
  });
});

