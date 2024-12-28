import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface UploadedImage {
  url: string;
  title: string;
  added: boolean;
  isFooter?: boolean;
}

interface ImageUploadSectionProps {
  uploadedImages: UploadedImage[];
  setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
}

export const ImageUploadSection = ({ uploadedImages, setUploadedImages }: ImageUploadSectionProps) => {
  const { toast } = useToast();
  const [isFooterImage, setIsFooterImage] = useState(false);

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
          added: false,
          isFooter: isFooterImage
        };
      });

      const newImages = await Promise.all(uploadPromises);
      setUploadedImages([...uploadedImages, ...newImages]);
      
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
    setUploadedImages(updatedImages);
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
    updatedImages[index] = { 
      ...updatedImages[index], 
      added: true,
      isFooter: isFooterImage 
    };
    setUploadedImages(updatedImages);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);
  };

  return (
    <div>
      <Label>Upload Images</Label>
      <div className="mt-2 space-y-2">
        <div className="flex items-center gap-2">
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
            className="flex-1"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Images
          </Button>
          <Button
            variant={isFooterImage ? "default" : "outline"}
            onClick={() => setIsFooterImage(!isFooterImage)}
            className="whitespace-nowrap"
          >
            {isFooterImage ? "Footer Image" : "Content Image"}
          </Button>
        </div>
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
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={image.added ? "secondary" : "default"}
                    onClick={() => handleAddImageToEmail(index)}
                    disabled={image.added}
                    className={image.added ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : ""}
                  >
                    {image.added ? `Added as ${image.isFooter ? 'Footer' : 'Content'}` : 'Add to Email'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};