import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Image, MessageSquare, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "./Navbar/Navbar";
import { AuthProvider } from "@/contexts/authContext";
import { Toaster } from "./ui/toaster";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <AuthProvider>
        {/* Top Navigation */}
        <Navbar />
        {/* Main Content */}
        <main className="pb-8">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="col-span-3">
              <Card className="p-4">
                <div className="text-center">
                  <Avatar className="h-16 w-16 mx-auto">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <h2 className="mt-2 font-semibold">User Name</h2>
                  <p className="text-sm text-gray-500">Headline</p>
                </div>
              </Card>
            </div>

            {/* Main Feed */}
            <div className="col-span-6">
              <Card className="p-4 mb-4">
                <div className="flex gap-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-gray-500"
                  >
                    Start a post
                  </Button>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <Image className="w-5 h-5 mr-2" />
                    Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Job
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-600">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Write article
                  </Button>
                </div>
              </Card>

              {/* Feed Post */}
              <Card className="p-4">
                <div className="flex items-start gap-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>ITB</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      Institut Teknologi Bandung (ITB)
                    </h3>
                    <p className="text-sm text-gray-500">171,606 followers</p>
                    <p className="text-sm text-gray-500">3jam • 🌐</p>
                  </div>
                </div>
                <p className="mt-4">
                  ITB Hadirkan Inovasi Water Refill Station Berbasis Teknologi
                  Gravity Driven Membrane di Kampung Ilmu, Purwakarta
                </p>
              </Card>
            </div>
          </div>
        </main>
        <Toaster />
      </AuthProvider>
    </div>
  );
}
