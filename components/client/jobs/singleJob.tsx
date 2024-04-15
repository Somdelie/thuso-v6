/* eslint-disable react/no-unescaped-entities */
"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProposalSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Job } from "@prisma/client";

interface jobProps {
  job: Job;
}

export function JobDetailsModal({ job }: jobProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const jobId = job.id;

  console.log(jobId);

  const form = useForm<z.infer<typeof ProposalSchema>>({
    resolver: zodResolver(ProposalSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof ProposalSchema>) {
    const formDataWithJobId = { ...values, jobId };

    axios
      .post("/api/proposal", formDataWithJobId)
      .then((res) => {
        console.log(res.data); // Log the response data to see its structure
        toast({
          variant: "success",
          description: "🎉 Proposal sent succefuly!",
        });
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            variant: "destructive",
            description: "You already sent an application for this job!",
          });
        } else {
          toast({
            variant: "destructive",
            description: "Something went wrong please try again later!",
          });
        }
        setIsLoading(false);
        // setSuccess(true); // Set success state to true
      });
    console.log(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Apply Now</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80%] sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Appy for: {job?.title}</DialogTitle>
          <DialogDescription>
            Fill in the form below to submit your application!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full py-4">
            <div className="w-full">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Ndoe" {...field} type="text" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Application description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about your proposal...."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Hidden input field to hold the job ID */}
              <input type="hidden" name="jobId" value={jobId} />
            </div>

            <Button type="submit" className="mt-4 w-1/2">
              <span>{isLoading ? "Submiting" : "Submit"}</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
