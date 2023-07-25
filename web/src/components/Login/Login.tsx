import { Fragment, useState, useRef, useEffect, SetStateAction, ReactNode } from 'react'
import { Transition } from "@headlessui/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { clsx } from "clsx";
import Toast from "src/components/UIComponents/Toast";
import Signup from "src/components/Signup";
import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

const Login = ({ setSeed, children }: {
  setSeed: SetStateAction<number>;
  children: ReactNode
}) => {
  const { isAuthenticated, logIn } = useAuth()

  const [isOpen, setIsOpen] = useState(false);

  const [toggle, setToggle] = useState(false);
  const [title, setTitle] = useState<string>();
  const [desc, setDesc] = useState<string>();

  const onSubmit = async (data: Record<string, string>) => {
    const response = await logIn({
      username: data.username,
      password: data.password,
    })

    if (response.message) {
      setTitle('Login Message');
      setDesc(response.message);
      setToggle(true);
    } else if (response.error) {
      setTitle('Error logging in');
      setDesc(response.error);
      setToggle(true);
    } else {
      setIsOpen(false);
      setTitle('Logging in successful');
      setDesc(`Welcome back ${data.username}!`);
      setToggle(true);

      setSeed(Math.random());
    }
  }

  return (
    <>
      <Toast title={title} desc={desc} toggle={toggle} />

      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPrimitive.Trigger asChild>
          {children}
        </DialogPrimitive.Trigger>

        <DialogPrimitive.Portal forceMount>
          <Transition.Root show={isOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogPrimitive.Overlay
                forceMount
                className="fixed inset-0 z-20 bg-black/50"
              />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPrimitive.Content
                forceMount
                className={clsx(
                  "fixed z-50",
                  "w-[95vw] max-w-md rounded-lg p-4 md:w-full",
                  "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                  "bg-white dark:bg-gray-800",
                  "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                )}
              >
                <DialogPrimitive.Title className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Login
                </DialogPrimitive.Title>
                <Form onSubmit={onSubmit} className="mt-2 space-y-2">
                  <fieldset>
                    <Label
                      name="username"
                      errorClassName="rw-label rw-label-error"
                      className="text-xs font-medium text-gray-700 dark:text-gray-400"
                    >
                      Username
                    </Label>
                    <TextField
                      name="username"
                      validation={{
                        required: {
                          value: true,
                          message: 'Username is required',
                        },
                      }}
                      placeholder='Username'
                      autoComplete="given-name"
                      className={clsx(
                        "mt-1 block w-full rounded-md",
                        "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                        "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                        "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                      )}
                      errorClassName="rw-input rw-input-error"
                    />
                    <FieldError name="username" className="rw-field-error" />
                  </fieldset>

                  <fieldset>
                    <Label
                      name="password"
                      errorClassName="rw-label rw-label-error"
                      className="text-xs font-medium text-gray-700 dark:text-gray-400"
                    >
                      Password
                    </Label>
                    <PasswordField
                      name="password"
                      autoComplete="current-password"
                      validation={{
                        required: {
                          value: true,
                          message: 'Password is required',
                        },
                      }}
                      placeholder="Password"
                      autoComplete="family-name"
                      className={clsx(
                        "mt-1 block w-full rounded-md",
                        "text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600",
                        "border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800",
                        "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                      )}
                      errorClassName="rw-input rw-input-error"
                    />
                    <FieldError name="password" className="rw-field-error" />
                  </fieldset>

                  <div className="mt-4 flex justify-end">
                    <Submit
                      className={clsx(
                        "inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium",
                        "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-700 dark:text-gray-100 dark:hover:bg-purple-600",
                        "border border-transparent",
                        "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                      )}
                    >Login</Submit>
                  </div>
                </Form>

                <DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400 flex">
                  <span>Don&apos;t have an account?</span>{' '}
                  <Signup>
                    <p className='underline hover:cursor-pointer text-blue-600 px-1'>
                      Sign up!
                    </p>
                  </Signup>
                </DialogPrimitive.Description>

                <DialogPrimitive.Close
                  className={clsx(
                    "absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1",
                    "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                  )}
                >
                  <Cross1Icon className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
                </DialogPrimitive.Close>
              </DialogPrimitive.Content>
            </Transition.Child>
          </Transition.Root>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
};

export default Login;
