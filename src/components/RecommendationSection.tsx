import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "./CourseCard";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface RecommendationSectionProps {
  user: any;
  title: string;
  subtitle?: string;
  limit?: number;
}

const RecommendationSection = ({ 
  user, 
  title, 
  subtitle,
  limit = 4 
}: RecommendationSectionProps) => {
  const [courses, setCourses] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const fetchRecommendations = async () => {
    const { data } = await supabase
      .from("courses")
      .select("*, providers(*)")
      .eq("is_visible", true)
      .order("rating", { ascending: false })
      .limit(limit);
    
    if (data) setCourses(data);
  };

  const handleSaveCourse = async (courseId: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save courses",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const { error } = await supabase
      .from("user_saved_courses")
      .insert({ user_id: user.id, course_id: courseId });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already saved",
          description: "This course is already in your library",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save course",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Course saved!",
        description: "Added to your library",
      });
    }
  };

  if (courses.length === 0) return null;

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6 min-w-max">
          {courses.map((course) => (
            <div key={course.id} className="w-[350px] flex-shrink-0">
              <CourseCard
                id={course.id}
                title={course.title}
                provider={course.providers?.name}
                instructor={course.instructor}
                rating={course.rating}
                reviewCount={course.review_count}
                price={course.price}
                priceTier={course.price_tier}
                skillLevel={course.skill_level}
                thumbnailUrl={course.thumbnail_url}
                durationHours={course.duration_hours}
                onSave={handleSaveCourse}
                showSaveButton={!!user}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendationSection;
