import React from "react";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

// Social Media Icons
const GoogleIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={cn("h-4 w-4", className)}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const GithubIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cn("h-4 w-4", className)}
  >
    <path
      fill="currentColor"
      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
    />
  </svg>
);

const FacebookIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cn("h-4 w-4", className)}
    fill="currentColor"
  >
    <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
  </svg>
);

const LinkedInIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cn("h-4 w-4", className)}
    fill="currentColor"
  >
    <path d="M6.94 5a2 2 0 1 1-4-.002a2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
  </svg>
);

const SocialButton = ({ provider, icon: Icon, href, disabled, className }) => (
  <Button
    variant="outline"
    className={cn(
      "w-full flex items-center justify-center gap-2",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
    asChild
    disabled={disabled}
  >
    <Link href={href} method="get" preserveScroll>
      <Icon className="h-4 w-4" />
      <span>Continue with {provider}</span>
    </Link>
  </Button>
);

const SocialLogin = ({ enabledProviders = {} }) => {
  const providers = [
    {
      name: "Google",
      icon: GoogleIcon,
      href: route('auth.social.redirect', { provider: 'google' }),
      enabled: enabledProviders.google_login_enabled,
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      href: route('auth.social.redirect', { provider: 'facebook' }),
      enabled: enabledProviders.facebook_login_enabled,
    },
    {
      name: "GitHub",
      icon: GithubIcon,
      href: route('auth.social.redirect', { provider: 'github' }),
      enabled: enabledProviders.github_login_enabled,
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      href: route('auth.social.redirect', { provider: 'linkedin' }),
      enabled: enabledProviders.linkedin_login_enabled,
    },
  ].filter(provider => provider.enabled);

  if (providers.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {providers.map(({ name, icon, href }) => (
          <SocialButton
            key={name}
            provider={name}
            icon={icon}
            href={href}
          />
        ))}
      </div>
    </div>
  );
};

export default SocialLogin; 