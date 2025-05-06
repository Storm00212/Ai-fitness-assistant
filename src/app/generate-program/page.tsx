"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { vapi } from "@/lib/vapi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const GeneratePage = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);


  // SOLUTION to get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;
    // override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return; // don't pass to original handler
      }

      // pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    // restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);
  //auto-scroll to the bottom of the message container when a new message is added.
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);
  //navigate to the profile page when the call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500); // 1.5 seconds delay before redirecting
      return () => clearTimeout(redirectTimer); // Cleanup the timer on unmount or when callEnded changes.
    }
  }, [callEnded, router]);
  //set up event listeners for the vapi object
  // to handle call start, end, speech start, speech end, message received, and error events

  useEffect(() => {
    const handleCallStart = () => {
      console.log("Call started");
      setCallActive(true);
      setConnecting(false);
      setCallEnded(false);
    };
    const handleCallEnd = () => {
      console.log("Call ended");
      setCallActive(false);
      setConnecting(false);
      setCallEnded(true);
      setIsSpeaking(false);
    };
    const handleSpeechStart = () => {
      console.log("AI has started speaking");
      setIsSpeaking(true);
    };
    const handleSpeechEnd = () => {
      console.log("AI has stopped speaking");
      setIsSpeaking(false);
    };
    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const handleError = (error: any) => {
      console.log("Vapi error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);
    // Initialize the event listeners when the component mounts

    return () => {
      vapi
        .off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    }; // Cleanup the event listeners when the component unmounts
  }, []);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);
        const fullName = user?.firstName
          ? `${user?.firstName} ${user?.lastName || ""}`.trim()
          : "There"; // Fallback name if firstName is not available.
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
            user_id : user?.id,
          },
        });
      } catch (error) {
        console.error("Error starting call:", error);
        setConnecting(false);
      }
    }
  };
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24">
      <div className="container mx-auto px-4 h-full max-w-5xl">
        {/** Header */}
        <div className="text-center mb-8">
          <h1 className=" text-2xl font-bold font-mono">
            <span>Generate your</span>
            <span>{/**some space between the words */} </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Talk to our AI assistant to generate a personalized fitness program
            for you.
          </p>
        </div>

        {/**Video call area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/** AI assistant card */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="aspect-video flex flex-col items-center justify-center p-6">
              {/**AI voice animation */}
              <div
                className={`absolute inset-0 ${
                  isSpeaking ? "opacity-30" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {/* Voice wave animation when speaking */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                        isSpeaking ? "animate-sound-wave" : ""
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking
                          ? `${Math.random() * 50 + 20}%`
                          : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>
              {/**AI image */}
              <div className="relative size-32 mb-4">
                <div
                  className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                    isSpeaking ? "animate-pulse" : ""
                  }`}
                />
                <div
                  className="relative w-full h-full rounded-full bg-card flex items-center justify-center
                border border-border overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10"></div>

                  <img
                    src="/hero-ai.png"
                    alt="AI Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <h2 className="text-xl font-bold text-foreground">
                Fitness Assistant AI
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Fitness & Diet Coach
              </p>
              {/** speaking indicator */}
              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border
                ${isSpeaking ? "border-primary" : ""}`}
              >
                <div
                  className={`w-2 h-2 rounded-full 
                     ${isSpeaking ? "bg-primary animate-pulse" : "bg-muted"}`}
                />
                <span className="text-xs text-muted-foreground">
                  {isSpeaking
                    ? "Fitness coach speaking"
                    : callActive
                      ? "Listening..."
                      : callEnded
                        ? "Redirecting to profile..."
                        : "Waiting.."}
                </span>
              </div>
            </div>
          </Card>
          {/** User card */}

          <Card>
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className="relative size-32 mb-4">
                <img
                  src={user?.imageUrl}
                  alt="User"
                  // ADD THIS "size-full" class to make it rounded on all images
                  className="size-full object-cover rounded-full"
                />
              </div>

              <h2 className="text-xl font-bold text-foreground">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user
                  ? (user.firstName + " " + (user.lastName || "")).trim()
                  : "Guest"}
              </p>

              {/* User Ready Text */}
              <div
                className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}
              >
                <div className={`w-2 h-2 rounded-full bg-muted`} />
                <span className="text-xs text-muted-foreground">Ready</span>
              </div>
            </div>
          </Card>
        </div>
        {/**message container will go here */}
        {messages.length > 0 && (
          <div
            ref={messageContainerRef}
            className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto
            transition-all duration-300 scroll-smooth"
          >
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div key={index} className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    {msg.role === "assistant" ? "Fitness AI" : "You"}
                  </div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))}
              {callEnded && (
                <div className="message-item animate-fadeIn">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    System:
                  </div>
                  <p className="text-foreground">
                    Your fitness goal has been created.Redirecting to your
                    profile...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/**Call controls */}
        <div className="w-full flex justify-center gap-4">
          <Button
            className={`w-40 text-xl rounded-3xl ${
              callActive
                ? "bg-destructive hover:bg-destructive/80"
                : callEnded
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary hover:bg-primary/90"
            }text-white relative`}
            onClick={toggleCall}
            disabled={connecting || callEnded}
          >
            {connecting && (
              <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
            )}
            <span>
              {callActive
                ? "End Call"
                : connecting
                  ? "Connecting"
                  : callEnded
                    ? "View Profile"
                    : "Start Call"}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GeneratePage;
