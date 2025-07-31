'use client';
import { useEffect, useState } from 'react';
import { useExerciseStore } from '@/stores/useExerciseStore';
import { Exercise } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { ColumnDef, DataTable } from '@/components/common/DataTables';
import { ExerciseModal } from '@/components/ExerciseModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export default function ExercisesPage() {
  const { exercises, loading, fetchExercises, addExercise, updateExercise, deleteExercise } = useExerciseStore();
  
  // State for modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    if (exercises.length === 0) fetchExercises();
  }, [exercises.length, fetchExercises]);

  const handleOpenModal = (exercise: Exercise | null = null) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

  const handleOpenConfirm = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setSelectedExercise(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedExercise) {
      deleteExercise(selectedExercise._id);
    }
    handleCloseConfirm();
  };

  const handleFormSubmit = async (formData: FormData) => {
    let success = false;
    if (selectedExercise) {
      success = await updateExercise(formData);
    } else {
      success = await addExercise(formData);
    }
    
    if (success) {
      handleCloseModal();
    }
  };

  const columns: ColumnDef<Exercise>[] = [
    { accessorKey: 'name', header: 'Name', cell: ({ row }) => <div className="font-medium">{row.original.name}</div> },
    { 
      accessorKey: 'category', 
      header: 'Category', 
      cell: ({ row }) => row.original.category.title // Correctly display the category title
    },
    { accessorKey: 'reps', header: 'Reps', cell: ({ row }) => row.original.reps },
    { accessorKey: 'sets', header: 'Sets', cell: ({ row }) => row.original.sets },
    { accessorKey: 'tags', header: 'Tags', cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
      </div>
    )},
    {
      id: 'actions',
      header: 'Actions', 
      cell: ({ row }) => {
        const exercise = row.original;
        return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleOpenModal(exercise)}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={() => handleOpenConfirm(exercise)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )
      }
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="Exercise Library" actionButtonText="Add New Exercise" onActionButtonClick={() => handleOpenModal()} />
      <DataTable
        columns={columns}
        data={exercises}
        searchKey="name"
        isLoading={loading && exercises.length === 0}
      />
      <ExerciseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={selectedExercise}
        isLoading={loading}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDeleteConfirm}
        title="Are you absolutely sure?"
        description={`This action cannot be undone. This will permanently delete the "${selectedExercise?.name}" exercise.`}
      />
    </div>
  );
}
