// import { useMemo, useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useMutation } from "@tanstack/react-query";
// import * as yup from 'yup';
import Card from "../../components/Card/Card";
import Label from "../../components/Label/Label";
import Input from "../../components/Input/Input";
// import Select from "../../components/Select/Select";
import Button from "../../components/Button";
import Container from "../../components/Container/Container";
// import { useNavigate } from 'react-router-dom';
// import authApi, { type RegisterRequest } from "../../apis/auth.api";
// import { AppContext } from "../../contexts/app.context";
// import { useContext } from "react";

// type Role = "attendee" | "organizer";

// const registerSchema = yup.object({
//   name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
//   email: yup.string().required('Email is required').email('Invalid email format'),
//   password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
//   confirm_password: yup.string().required('Password confirmation is required').oneOf([yup.ref('password')], 'Passwords do not match')
// });

// type RegisterForm = yup.InferType<typeof registerSchema>;

export default function SigninPage() {
  // const nav = useNavigate();
  // const { setIsAuthenticated } = useContext(AppContext);
  // const [role, setRole] = useState<Role>("attendee");
  // const [agreed, setAgreed] = useState(false);

  // organizer-only fields
  // const [orgName, setOrgName] = useState("");
  // const [orgWebsite, setOrgWebsite] = useState("");

  // const {
  //   register,
  //   handleSubmit,
  //   setError,
  //   formState: { errors }
  // } = useForm({
  //   resolver: yupResolver(registerSchema),
  //   defaultValues: {
  //     name: '',
  //     email: '',
  //     password: '',
  //     confirm_password: ''
  //   }
  // });

  // const registerMutation = useMutation({
  //   mutationFn: (body: RegisterRequest) => {
  //     return authApi.registerAccount(body);
  //   }
  // });

  // const valid = useMemo(() => {
  //   const baseOk = agreed;
  //   if (role === "attendee") return baseOk;
  //   return baseOk && !!orgName; // organizer must provide org name
  // }, [agreed, role, orgName]);

  return (
    <section id="signin" className="py-10 sm:py-14">
      <Container>
        <div className="mx-auto max-w-md">
          <Card>
            <header>
              <h2 className="text-2xl font-semibold">Create your account</h2>
            </header>


            <form
              className="mt-4 grid gap-4" noValidate>
{/*               
              onSubmit={handleSubmit((data: RegisterForm) => {
                if (!valid) return;
                console.log('Registration attempt with data:', data);
                // registerMutation.mutate(data as RegisterRequest, {
                  onSuccess: (response) => {
                    console.log('Registration success:', response.data);
                    // Store tokens in localStorage
                    localStorage.setItem('access_token', response.data.result.access_token);
                    localStorage.setItem('refresh_token', response.data.result.refresh_token);
                    setIsAuthenticated(true);
                    // Redirect by role
                    if (role === "organizer") nav("/organizer");
      
              })}  */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  // register={register}
                  placeHolder="Enter your full name"
                  className="mt-1"
                  // errorMessages={errors.name?.message}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  // register={register}
                  placeHolder="you@email.com"
                  className="mt-1"
                  // errorMessages={errors.email?.message}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  // register={register}
                  placeHolder="At least 6 characters"
                  className="mt-1"
                  // errorMessages={errors.password?.message}
                />
              </div>

              <div>
                <Label htmlFor="confirm_password">Confirm Password</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  // register={register}
                  placeHolder="Re-enter your password"
                  className="mt-1"
                  // errorMessages={errors.confirm_password?.message}
                />
              </div>

 
              <Button type="submit">
                Create account
              </Button>
            </form>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-pink-600 hover:underline">Log in</a>
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
}
