/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { JobSchema } from "@/schemas";
import { Textarea } from "@/components/ui/textarea";
import { jobTypes, locationTypes } from "@/lib/job-types";
import { useEffect, useRef, useState } from "react";
import { UploadButton } from "@/components/ui/uploadthing";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Loader2, XCircle } from "lucide-react";
import axios from "axios";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import { useRouter } from "next/navigation";

// import { JobSchema } from "@/schemas";

interface CreateJobProps {
  job: Job | null;
}

const CreateJobForm = ({ job }: CreateJobProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageIsDeleting, SetImageIsDeleting] = useState(false);
  const [image, setImage] = useState(job?.image);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const isMounted = useRef(true);

  const { toast } = useToast();
  const router = useRouter();
  const { getAllCountries, getCountryStates, getStateCities } = useLocation();

  const countries = getAllCountries();

  const form = useForm<z.infer<typeof JobSchema>>({
    resolver: zodResolver(JobSchema),
    defaultValues: job
      ? {
          ...job, // Spread the job object to initialize the form with its values
          image: job ? job.image || "" : "", // Handle null value for image
          location: job.location ?? undefined,
        }
      : {
          title: "",
          type: "",
          locationType: "",
          country: "",
          state: "",
          city: "",
          image: "",
          description: "",
          // Add other properties as needed
        },
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [form, image]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedSatte = form.watch("state");
    const stateCities = getStateCities(selectedCountry, selectedSatte);
    if (stateCities) {
      setCities(stateCities);
    }
  }, [form.watch("country"), form.watch("state")]);

  function onSubmit(values: z.infer<typeof JobSchema>) {
    if (form.watch("locationType") === "On-site" && !values.location) {
      // Display an error message or handle it as needed
      setErrorMessage("Location is required");
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);
    if (job) {
      //update
      console.log(job);
    } else {
      axios
        .post("/api/job", values)
        .then((res) => {
          console.log(res.data); // Log the response data to see its structure
          toast({
            variant: "success",
            description: "🎉 Job Created",
          });
          router.push("/dashboard");
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
          setIsLoading(false);
        });
    }
    console.log(values);
  }

  const handleImageDelete = (image: string) => {
    SetImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1); // Corrected

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast({
            variant: "success",
            description: "Image removed",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "Failed to remove image",
        });
      })
      .finally(() => {
        SetImageIsDeleting(false);
      });
  };

  return (
    <div className="max-w-[80%] mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[80%] mx-auto py-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. painter" {...field} type="text" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select country"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries?.map((country) => {
                          return (
                            <SelectItem
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading || states.length < 1}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select state"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states?.map((state) => {
                          return (
                            <SelectItem
                              key={state.isoCode}
                              value={state.isoCode}
                            >
                              {state.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading || cities.length < 1}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select town/city"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities?.map((city) => {
                          return (
                            <SelectItem key={city.name} value={city.name}>
                              {city.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>job Type</FormLabel>
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
                      {jobTypes.map((jobType) => (
                        <SelectItem key={jobType} value={jobType}>
                          {jobType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>job Type</FormLabel>
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
                      {locationTypes.map((locationType) => (
                        <SelectItem key={locationType} value={locationType}>
                          {locationType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {form.watch("locationType") === "On-site" && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 57 jolex road"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

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
                          onClick={() => handleImageDelete(image)}
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="absolute top-0 right-0"
                          disabled={isLoading}
                        >
                          {imageIsDeleting ? <Loader2 /> : <XCircle />}
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full border-2 rounded border-dashed flex items-center">
                        <UploadButton
                          {...field}
                          appearance={{
                            button:
                              "ut-ready:bg-gray-500 w-full ut-uploading:cursor-not-allowed rounded-r-none bg-red-500 bg-none after:bg-orange-400",
                            container:
                              "w-full grid grid-cols-2 rounded border-cyan-300 ",
                            allowedContent:
                              "flex h-8 flex-col items-center justify-center px-2 text-white",
                          }}
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            setImage(res[0].url);
                            toast({
                              variant: "success",
                              description: "🎉 Upload Completed",
                            });
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: "destructive",
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                        />
                      </div>
                    )}
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Job description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us more about the job...."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="mt-4 w-1/2">
            {job ? (
              <span>{isLoading ? "updating" : "Update"}</span>
            ) : (
              <span>{isLoading ? "Submiting" : "Submit"}</span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateJobForm;
