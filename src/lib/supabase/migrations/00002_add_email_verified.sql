-- Create a table for tracking email verification
CREATE TABLE IF NOT EXISTS public.user_status (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_status ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public user_status are viewable by everyone"
    ON public.user_status FOR SELECT
    USING (true);

CREATE POLICY "Users can update own status"
    ON public.user_status FOR UPDATE
    USING (auth.uid() = user_id);

-- Create a function to handle email verification
CREATE OR REPLACE FUNCTION public.handle_email_verify()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_status (user_id, email_verified)
    VALUES (NEW.id, TRUE)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        email_verified = TRUE,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that fires when email is verified
DROP TRIGGER IF EXISTS on_email_verify ON auth.users;
CREATE TRIGGER on_email_verify
    AFTER UPDATE OF email_confirmed_at
    ON auth.users
    FOR EACH ROW
    WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
    EXECUTE FUNCTION public.handle_email_verify(); 