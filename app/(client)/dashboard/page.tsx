/* eslint-disable react/no-unescaped-entities */

import ProjectsData from "@/components/client/projects/ProjectsData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserById } from "@/data/user";
import { currentUser } from "@/hooks/use-current-user";
import React from "react";

const UserDashboard = async () => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const userId = user.id;

  const dbUser = await getUserById(userId);
  // console.log(user);
  return (
    <div className="w-full py-4">
      <Tabs
        defaultValue="projects"
        className="w-[90%] mx-auto flex flex-col justify-center"
      >
        <div className="grid space-y-4 sm:space-y-0 sm:grid-cols-2">
          <TabsList className="">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="messages">Massages</TabsTrigger>
          </TabsList>
          <div>
            <div className="sm:text-right">
              <h2 className="text-muted-foreground">
                Welcome Back:{" "}
                <span className="font-semibold">{user?.name}</span>
              </h2>
            </div>
          </div>
        </div>
        <TabsContent value="projects" className="">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription className="sm:text-right">
                You can view or manage your jobs at anytime!
              </CardDescription>
            </CardHeader>
            <ProjectsData dbUser={dbUser as any} />
          </Card>
        </TabsContent>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                You can view or manage your profile at anytime!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">{user?.email}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Jobs</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">{user?.email}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="earnings">Earnings</TabsContent>
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">{user?.email}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
