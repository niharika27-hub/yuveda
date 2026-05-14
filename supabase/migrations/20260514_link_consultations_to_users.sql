-- Link consultations to users by matching email
UPDATE public.consultation_requests cr
SET user_id = au.id
FROM auth.users au
WHERE cr.user_id IS NULL 
  AND cr.email IS NOT NULL
  AND au.email = cr.email;
