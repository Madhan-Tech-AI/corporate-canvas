import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/90 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-charcoal border border-border rounded-sm p-8 md:p-10 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/60 hover:text-cream transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-serif text-cream mb-3">Sign In Required</h2>
          <p className="text-cream-muted mb-8">
            Please sign in or create an account to add items to your bag and complete your purchase.
          </p>

          <div className="space-y-4">
            <Link
              to="/login"
              className="block w-full btn-primary text-center"
              onClick={onClose}
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="block w-full btn-secondary text-center"
              onClick={onClose}
            >
              Create Account
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-8">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-champagne hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-champagne hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
