"use client";
import * as z from "zod";
import { FormError } from "@/components/ui/FormError";
import { FormSuccess } from "@/components/ui/FormSuccess";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Oval, Vortex } from "react-loader-spinner";
import { FreelancerSchema } from "@/schemas";
import { registerFreelancer } from "@/actions/register-user";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/components/ui/uploadthing";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { CldUploadButton, CldUploadWidget } from "next-cloudinary";

const VendorForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [imageIsDeleting, SetImageIsDeleting] = useState(false);
  const [image, setImage] = useState("");

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FreelancerSchema>>({
    resolver: zodResolver(FreelancerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      image: "",
      address: "",
      about: "",
      category: "",
      jobType: "",
      phone: "",
      documentPhoto: "",
      role: "FREELANCER",
    },
  });

  const onSubmit = (values: z.infer<typeof FreelancerSchema>) => {
    setError("");
    setSuccess("");
    values.role = "FREELANCER";
    startTransition(() => {
      registerFreelancer(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-2 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Ndoe"
                      type="text"
                      className="border-2 dark:border-gray-500 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="somdelie@example.com"
                      type="email"
                      className="border-2 dark:border-gray-500 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                      className="border-2 dark:border-gray-500 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="0123 456 7890"
                      type="text"
                      className="border-2 dark:border-gray-500 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* {jobTypes.map((jobType) => (
                        <SelectItem key={jobType} value={jobType}>
                          {jobType}
                        </SelectItem>
                      ))} */}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {/* About Field */}
            <FormField
              control={form.control}
              name="jobType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tell Us About Your Profession</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Tell us about yourself"
                      type="text"
                      className="border-2 dark:border-gray-500 rounded"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload an image</FormLabel>
                  <FormControl>
                    {image ? (
                      <div className="w-full relative h-full">
                        <Image
                          height={100}
                          width={100}
                          src={image}
                          alt="Job Image"
                          className="object-contain rounded"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute top-0 right-0"
                          disabled={isPending}
                        >
                          {imageIsDeleting ? <Loader2 /> : <XCircle />}
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full border-2 rounded border-dashed flex items-center">
                        <CldUploadWidget uploadPreset="thuso.com">
                          {({ open }) => {
                            return (
                              <Button onClick={() => open()} type="button">
                                Upload an Image
                              </Button>
                            );
                          }}
                        </CldUploadWidget>
                      </div>
                    )}
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div>
            <Button
              type="submit"
              disabled={isPending}
              className="w-1/2 bg-sky-600 rounded text-white hover:bg-sky-700"
            >
              {isPending ? (
                <div className="flex items-center gap-4">
                  <Oval
                    visible={true}
                    height="20"
                    width="20"
                    color="#fff"
                    ariaLabel="oval-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                  <span>Please wait...</span>
                </div>
              ) : (
                "Create an account"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VendorForm;
