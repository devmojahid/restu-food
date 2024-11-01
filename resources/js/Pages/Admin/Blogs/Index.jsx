import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { format } from "date-fns";
import AdminLayout from "@/Layouts/AdminLayout";

const BlogIndex = ({ blogs }) => {
  return (
    <AdminLayout>
      <Head title="Blogs" />

      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Blogs</h1>
          <Link href={route("admin.blogs.create")}>
            <Button>Create Blog</Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        blog.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.is_published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {blog.published_at
                      ? format(new Date(blog.published_at), "PPP")
                      : "-"}
                  </TableCell>
                  <TableCell>{blog.user.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link
                        href={route("admin.blogs.edit", blog.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <Link
                        href={route("admin.blogs.destroy", blog.id)}
                        method="delete"
                        as="button"
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogIndex;
