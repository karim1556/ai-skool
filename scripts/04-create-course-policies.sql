
-- Allow admins to perform all operations on the courses table
CREATE POLICY "Allow admins all access to courses"
ON public.courses
FOR ALL
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Allow all users to read courses
CREATE POLICY "Allow public read access to courses"
ON public.courses
FOR SELECT
TO public
USING (true); 