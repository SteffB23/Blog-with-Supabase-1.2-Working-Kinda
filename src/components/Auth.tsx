import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';

export const Auth = () => {
  return (
    <div className="mx-auto max-w-md">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#111827',
                brandAccent: '#374151',
              },
            },
          },
        }}
        providers={['github']}
      />
    </div>
  );
};