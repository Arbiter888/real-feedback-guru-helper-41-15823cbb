import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UploadedImage {
  url: string;
  title: string;
  added: boolean;
}

interface ImageUploadSectionProps {
  uploadedImages: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  onContentUpdate: () => void;
}

export const ImageUploadSection = ({ uploadedImages, onImagesChange, onContentUpdate }: ImageUploadSectionProps) => {
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('email_images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('email_images')
          .getPublicUrl(filePath);

        return {
          url: publicUrl,
          title: "",
          added: false
        };
      });

      const newImages = await Promise.all(uploadPromises);
      onImagesChange([...uploadedImages, ...newImages]);
      
      toast({
        title: "Images uploaded successfully",
        description: `${files.length} image(s) have been uploaded.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images.",
        variant: "destructive",
      });
    }
  };

  const handleImageTitleChange = (index: number, title: string) => {
    const updatedImages = [...uploadedImages];
    updatedImages[index] = { ...updatedImages[index], title };
    onImagesChange(updatedImages);
  };

  const handleAddImageToEmail = (index: number) => {
    if (!uploadedImages[index].title) {
      toast({
        title: "Missing image title",
        description: "Please provide a title for the image before adding it to the email.",
        variant: "destructive",
      });
      return;
    }

    const updatedImages = [...uploadedImages];
    updatedImages[index] = { ...updatedImages[index], added: true };
    onImagesChange(updatedImages);
    onContentUpdate();
  };

  return (
    <div>
      <Label>Upload Images</Label>
      <div className="mt-2 space-y-2">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <Button
          variant="outline"
          onClick={() => document.getElementById('image-upload')?.click()}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose Images
        </Button>
      </div>
      {uploadedImages.length > 0 && (
        <div className="mt-4 space-y-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
              <img
                src={image.url}
                alt={`Uploaded image ${index + 1}`}
                className="h-16 w-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <Input
                  placeholder="Enter image title"
                  value={image.title}
                  onChange={(e) => handleImageTitleChange(index, e.target.value)}
                  className="mb-2"
                />
                <Button
                  size="sm"
                  variant={image.added ? "secondary" : "default"}
                  onClick={() => handleAddImageToEmail(index)}
                  disabled={image.added}
                  className={image.added ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : ""}
                >
                  {image.added ? "Added to Email" : "Add to Email"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};