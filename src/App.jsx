import React from "react"
import { useState, useEffect } from "react";
import axios from "axios";

const API = "";

function App() {

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", image: null });
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/api/products`);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (editId) {

      await axios.put(`${API}/api/products/${editId}`, formData);
      setEditId(null);

    } else {

      await axios.post(`${API}/api/products`, formData);

    }

    setForm({ name: "", price: "", image: null });

    fetchProducts();

  };

  const handleDelete = async (id) => {

    await axios.delete(`${API}/api/products/${id}`);

    fetchProducts();

  };

  const handleEdit = (product) => {

    setForm({
      name: product.name,
      price: product.price
    });

    setEditId(product._id);

  };

  return (

    <div className="min-h-[100dvh] bg-gray-950 text-white p-6">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-center">
          🛍 Product Manager
        </h1>

        <div className="bg-gray-900 p-6 rounded-2xl shadow-lg mb-8">

          <form onSubmit={handleSubmit} className="grid gap-4">

            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="text-sm"
            />

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition p-3 rounded-lg font-semibold"
            >
              {editId ? "Update Product" : "Add Product"}
            </button>

          </form>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {products.map((p) => (

            <div
              key={p._id}
              className="bg-gray-900 rounded-2xl shadow-md p-4 hover:scale-105 transition"
            >

              <img
                src={`${API}/uploads/${p.image}`}
                alt=""
                className="w-full h-40 object-cover rounded-lg mb-3"
              />

              <h2 className="text-lg font-semibold">{p.name}</h2>

              <p className="text-gray-400 mb-3">
                ₹ {p.price}
              </p>

              <div className="flex gap-3">

                <button
                  onClick={() => handleEdit(p)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg text-black"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}

export default App;