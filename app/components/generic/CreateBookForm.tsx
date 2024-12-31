import { useUser } from "@clerk/react-router";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { Checkbox } from "../ui/checkbox";

const CreateBookForm = () => {
  const [formData, setFormData] = useState<Record<string, string | boolean>>({
    title: "",
    author: "",
    message: "",
    is_public: false,
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const user = useUser();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "title":
        return !value.trim()
          ? "Title is required"
          : value.length < 2
          ? "Title must be at least 2 characters"
          : "";
      case "author":
        return !value.trim()
          ? "Author is required"
          : value.length < 2
          ? "Author name must be at least 2 characters"
          : !/^[A-Za-z0-9\s.'-]+$/i.test(value)
          ? "Author name can only contain letters, numbers, spaces and basic punctuation"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name] && value.trim() !== "") {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_public: checked,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {} as any;
    Object.keys(formData).forEach((key) => {
      if (key !== "is_public" && key !== "message") {
        const error = validateField(key, formData[key] as string);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create FormData object for multipart/form-data submission
    const submitData = new FormData();
    submitData.append("title", formData.title as string);
    submitData.append("user_id", user.user?.id as string);
    submitData.append("author", formData.author as string);
    submitData.append("is_public", formData.is_public.toString());

    if (coverImage) {
      submitData.append("coverImage", coverImage);
    }

    try {
      const response = await fetch("http://localhost:3000/api/book", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();
      console.log("Form submitted:", result);

      // Clear form after successful submission
      setFormData({
        title: "",
        author: "",
        message: "",
        is_public: false,
      });
      setCoverImage(null);
      setImagePreview("");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4"
      encType="multipart/form-data"
    >
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title as string}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="author"
          className="block text-sm font-medium text-gray-700"
        >
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author as string}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.author && (
          <p className="text-red-500 text-sm">{errors.author}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="coverImage"
          className="block text-sm font-medium text-gray-700"
        >
          Cover Image
        </label>
        <input
          type="file"
          id="coverImage"
          name="coverImage"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Cover preview"
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_public"
          checked={!!formData.is_public}
          onCheckedChange={handleCheckboxChange}
        />
        <Label
          htmlFor="is_public"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Make this book public
        </Label>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};

export default CreateBookForm;
