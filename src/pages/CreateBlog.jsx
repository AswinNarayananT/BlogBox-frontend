import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createBlog } from "../redux/blog/blogThunk";
import {  FaArrowLeft } from "react-icons/fa";
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
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white pt-8 flex flex-col items-center">
          <button
          onClick={() => navigate(-1)}
          className="flex items-center bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition mb-8 self-start"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Create New Blog
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="w-full max-w-2xl bg-gray-900/50 backdrop-blur-md border border-gray-800 p-8 rounded-2xl shadow-lg space-y-6">
              <div>
                <label className="block mb-2 font-semibold">Title</label>
                <Field
                  type="text"
                  name="title"
                  className="w-full p-3 rounded bg-black/70 text-white border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
              </div>

              <div>
                <label className="block mb-2 font-semibold">Content</label>
                <Field
                  as="textarea"
                  name="content"
                  rows="5"
                  className="w-full p-3 rounded bg-black/70 text-white border border-gray-700 focus:border-purple-500 focus:outline-none transition-colors resize-none"
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
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-3 w-full h-48 object-cover rounded-lg border border-gray-700"
                  />
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
                <Field type="checkbox" name="is_published" className="accent-purple-600" />
                <label className="font-medium">Publish</label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
              >
                {isSubmitting ? "Creating..." : "Create Blog"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <Footer />
    </>
  );
}
