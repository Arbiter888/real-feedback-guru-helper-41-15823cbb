import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface MenuPreviewProps {
  menuUrl: string | null;
  analysis: any;
}

export const MenuPreview = ({ menuUrl, analysis }: MenuPreviewProps) => {
  const [showImage, setShowImage] = useState(true);

  if (!menuUrl) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Menu Preview</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowImage(!showImage)}
        >
          {showImage ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Hide Image
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Image
            </>
          )}
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {showImage && (
          <Card className="p-4">
            <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
              <img
                src={menuUrl}
                alt="Menu"
                className="object-cover w-full h-full"
              />
            </div>
          </Card>
        )}

        <Card className="p-4">
          <h4 className="font-medium mb-3">Analysis Results</h4>
          <div className="space-y-3">
            {analysis?.map((section: any, index: number) => (
              <div key={index} className="space-y-2">
                <h5 className="font-medium text-primary">{section.category}</h5>
                <ul className="space-y-1">
                  {section.items?.map((item: any, itemIndex: number) => (
                    <li key={itemIndex} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-medium">£{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};