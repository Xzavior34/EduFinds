import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  courseCount?: number;
  searchQuery: string;
}

const CategoryCard = ({ name, icon: Icon, courseCount, searchQuery }: CategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="group hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/courses?q=${encodeURIComponent(searchQuery)}`)}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {name}
          </h3>
          {courseCount !== undefined && (
            <p className="text-sm text-muted-foreground mt-1">
              {courseCount.toLocaleString()} courses
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
