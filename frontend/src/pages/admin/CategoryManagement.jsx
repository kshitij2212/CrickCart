import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import categoryService from "../../services/categoryService";
import toast from "react-hot-toast";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const CategoryManagement = () => {

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    color: "#00a8e8",
    images: [],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrls = editingCategory ? formData.images : [];

    if (imageFile) {
      const formDataImg = new FormData();
      formDataImg.append("images", imageFile);
      const uploadRes = await categoryService.uploadImages(formDataImg);
      imageUrls = uploadRes.images;
    }

    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.id, {
        name: formData.name,
        color: formData.color,
        images: imageUrls.length > 0 ? imageUrls : formData.images,
      });
      toast.success("Category updated successfully");
    } else {
      await categoryService.createCategory({
        name: formData.name,
        color: formData.color,
        images: imageUrls,
      });
      toast.success("Category created successfully");
    }

    handleCloseModal();
    fetchCategories();

  } catch (error) {
    console.error(error);
    toast.error(editingCategory ? "Failed to update category" : "Failed to create category");
  } finally {
    setSubmitting(false);
  }
};

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      images: category.images || [],
    });
    setImagePreview(category.images?.[0] || null);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDeleteClick = (category) => {
    setConfirmDialog({
      isOpen: true,
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await categoryService.deleteCategory(confirmDialog.categoryId);
      toast.success(`"${confirmDialog.categoryName}" deleted successfully`);
      setConfirmDialog({ isOpen: false, categoryId: null, categoryName: "" });
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({ name: "", color: "#00a8e8", images: [] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black italic text-[#00171f]">
          CATEGORY MANAGEMENT
        </h1>
        <button
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-[#00a8e8] text-white px-6 py-3 font-bold rounded hover:bg-[#0095d1]"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin h-12 w-12 border-b-2 border-[#00a8e8] rounded-full"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-10">
            No categories found
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden"
            >
              <div className="h-48 bg-gray-100">
                <img
                  src={category.images?.[0]}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl">{category.name}</h3>
                  <p className="text-gray-500 text-sm">{category.slug}</p>
                  <div
                    className="w-6 h-6 rounded-full mt-2 border"
                    style={{ backgroundColor: category.color }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(category)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editingCategory ? "EDIT CATEGORY" : "ADD CATEGORY"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-bold text-sm block mb-1">CATEGORY NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-gray-200 p-2 rounded focus:border-[#00a8e8] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-sm block mb-1">COLOR</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-12 h-10 border rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-500">{formData.color}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-sm block mb-1">IMAGE</label>

                {imagePreview && (
                  <div className="mb-2 relative w-full h-32 rounded overflow-hidden">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <label className="border-dashed border-2 border-gray-300 p-6 text-center block cursor-pointer rounded hover:border-[#00a8e8] transition">
                  <Upload className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {imageFile ? imageFile.name : "Click to upload image"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                        toast.success("Image selected: " + file.name);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#00a8e8] text-white py-3 font-bold rounded hover:bg-[#0095d1] disabled:opacity-50 transition"
                >
                  {submitting ? 'SAVING...' : editingCategory ? "UPDATE" : "CREATE"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 py-3 font-bold rounded hover:bg-gray-300 transition"
                >
                  CANCEL
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, categoryId: null, categoryName: "" })}
        onConfirm={handleDeleteConfirm}
        title="DELETE CATEGORY"
        message={`Are you sure you want to delete "${confirmDialog.categoryName}"?`}
        type="danger"
      />

    </div>
  );
};

export default CategoryManagement;