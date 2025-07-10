import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createBlog } from "../redux/blog/blogThunk";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";
import * as Yup from "yup";

export default function CreateBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const initialValues = {
    title: "",
    content: "",
    image: null,
    attachment: null,
    is_published: true,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(createBlog(values)).unwrap();
      toast.success("Blog created successfully!");
      navigate("/"); 
    } catch (error) {
      toast.error(error || "Failed to create blog");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-center">Create Blog</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="w-full max-w-2xl bg-gray-900 p-6 rounded-xl shadow-lg space-y-6">
            <div>
              <label className="block mb-2 font-semibold">Title</label>
              <Field
                type="text"
                name="title"
                className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Content</label>
              <Field
                as="textarea"
                name="content"
                rows="5"
                className="w-full p-3 rounded bg-black text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <ErrorMessage name="content" component="div" className="text-red-500 mt-1" />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setFieldValue("image", e.currentTarget.files[0]);
                  setImagePreview(URL.createObjectURL(e.currentTarget.files[0]));
                }}
                className="w-full text-white"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-3 w-full h-48 object-cover rounded" />
              )}
            </div>

            <div>
              <label className="block mb-2 font-semibold">Attachment</label>
              <input
                type="file"
                onChange={(e) => {
                  setFieldValue("attachment", e.currentTarget.files[0]);
                  setAttachmentPreview(e.currentTarget.files[0].name);
                }}
                className="w-full text-white"
              />
              {attachmentPreview && (
                <p className="mt-2 text-gray-400">Selected: {attachmentPreview}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Field type="checkbox" name="is_published" className="accent-white" />
              <label className="font-medium">Publish</label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black py-3 rounded font-bold hover:bg-gray-200 transition-all duration-300"
            >
              {isSubmitting ? "Creating..." : "Create Blog"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
