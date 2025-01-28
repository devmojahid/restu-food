import React from 'react';
import { useForm } from "@inertiajs/react";
import { usePageEditor } from '@/Components/Admin/PageBuilder/PageEditorContext';
import FeedbackTable from '../Components/FeedbackTable';
import FeedbackForm from '../Components/FeedbackForm';

const ClientFeedbackSection = () => {
  const { handleSave, isSaving } = usePageEditor();
  const { data, setData } = useForm({
    feedbacks: [],
    name: '',
    rating: '1',
    review: '',
    avatar: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleSave({
      ...data,
      feedbacks: [...data.feedbacks, {
        name: data.name,
        rating: data.rating,
        review: data.review,
        avatar: data.avatar
      }]
    });
  };

  return (
    <div className="space-y-8">
      <FeedbackTable feedbacks={data.feedbacks} />
      <FeedbackForm
        data={data}
        setData={setData}
        onSubmit={handleSubmit}
        isSubmitting={isSaving}
      />
    </div>
  );
};

export default ClientFeedbackSection; 