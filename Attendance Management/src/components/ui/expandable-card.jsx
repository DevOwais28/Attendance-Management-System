"use client";;
import React, { useRef, useEffect} from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Clock, GitBranch, Github, MessageSquare, Star, Users, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { useExpandable } from "@/hooks/use-expandable";

function TypographyInlineCode({children}) {
  return (
    <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold color-white">
      {children}
    </code>
  )
}


function TypographyH1({ children }) {
  return (
    <h1 className="text-white scroll-m-20 text-center text-3xl font-extrabold">
      {children}
    </h1>
  );
}


export function ProjectStatusCard({
  title,
  number
}) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef(null);
  // const [width, setWidth] = useState(0);

  // useEffect(() => {
  //   const updateWidth = () => {
  //     if (contentRef.current) {
  //       setWidth(contentRef.current.offsetWidth);
  //     }
  //   };
  //   updateWidth();
  //   window.addEventListener("resize", updateWidth);
  //   return () => {window.removeEventListener("resize", updateWidth);};
  // }, []);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  return (
    // <Card
      <Card className="w-full sm:w-[48%] md:w-[32%] max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-start w-full">
          <div className="space-y-2">
            <TypographyH1>{title}</TypographyH1>
          </div>
          </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              {/* <span>Progress</span> */}
              <TypographyInlineCode>{number}</TypographyInlineCode>              {/* <span>{progress}%</span> */}
            </div>
            {/* <ProgressBar value={progress} className="h-2" /> */}
          </div>

          {/* <motion.div
            style={{ height: animatedHeight }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden">
            <div ref={contentRef}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 pt-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Due {dueDate}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-400" />
                          <span>{githubStars}</span>
                        </div>
                        <div className="flex items-center">
                          <GitBranch className="h-4 w-4 mr-1" />
                          <span>{openIssues} issues</span>
                        </div>
                      </div>
                    </div> */}

                    {/* <div className="space-y-2">
                      <h4 className="font-medium text-sm flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Contributors
                      </h4>
                      <div className="flex -space-x-2">
                        {contributors.map((contributor, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="border-2 border-white">
                                  <AvatarImage
                                    src={
                                      contributor.image ||
                                      `/placeholder.svg?height=32&width=32&text=${contributor.name[0]}`
                                    }
                                    alt={contributor.name} />
                                  <AvatarFallback>
                                    {contributor.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{contributor.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div> */}
{/* {/* 
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recent Tasks</h4>
                      {tasks.map((task, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{task.title}</span>
                          {task.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))} 
                    </div>*/} 
{/* 
                    <div className="space-y-2">
                      <Button className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Discussion
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>*/}
        </div> 
      </CardContent>
    </Card>
  );
}
