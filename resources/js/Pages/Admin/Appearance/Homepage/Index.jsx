import React from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Admin/AdminLayout";
import { PageEditorProvider } from "@/Components/Admin/PageBuilder/PageEditorContext";
import SectionNavigation from "@/Components/Admin/PageBuilder/SectionNavigation";
import SectionContent from "@/Components/Admin/PageBuilder/SectionContent";
import ClientFeedbackSection from "./Sections/ClientFeedbackSection";
import TopCategoriesSection from "./Sections/TopCategoriesSection";
import WhyChooseUsSection from "./Sections/WhyChooseUsSection";
import HeroSection from "./Sections/HeroSection";
// Import other section components

const SECTIONS = [
  { id: 'hero', label: 'Hero Section', default: true },
  { id: 'top_categories', label: 'Top Categories' },
  { id: 'about_us', label: 'About Us' },
  { id: 'features', label: 'Features' },
  { id: 'popular_products', label: 'Popular Products' },
  { id: 'why_choose_us', label: 'Why Choose Us' },
  { id: 'client_feedback', label: 'Client Feedback' },
  { id: 'on_sale', label: 'On Sale Products' },
  { id: 'news', label: 'News And Blogs' },
];

const HomepageEditor = ({ homepageOptions = {}, defaults = {}, dynamicData = {} }) => {
  const { post } = useForm();
  const errors = usePage().props.errors;

  const handleSave = async (data) => {
    await post(route('app.appearance.homepage.update'), data);
  };

  // valdatetion errors
  return (
    <AdminLayout>
      <Head title="Homepage Editor" />
      {errors && (
        <div className="alert alert-danger">
          {errors.message}
        </div>
      )}
      <PageEditorProvider
        initialData={homepageOptions}
        onSave={handleSave}
      >
        <div className="container mx-auto py-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Main Content Area */}
            <div className="col-span-12 lg:col-span-8">
              {SECTIONS.map(section => (
                <SectionContent key={section.id} section={section}>
                  {section.id === 'hero' && (
                    <HeroSection />
                  )}
                  {section.id === 'client_feedback' && (
                    <ClientFeedbackSection />
                  )}
                  {section.id === 'top_categories' && (
                    <TopCategoriesSection />
                  )}
                  {section.id === 'why_choose_us' && (
                    <WhyChooseUsSection />
                  )}
                  {/* Add other section components */}
                </SectionContent>
              ))}
            </div>

            {/* Right Sidebar */}
            <div className="col-span-12 lg:col-span-4">
              <SectionNavigation sections={SECTIONS} />
            </div>
          </div>
        </div>
      </PageEditorProvider>
    </AdminLayout>
  );
};

export default HomepageEditor;
