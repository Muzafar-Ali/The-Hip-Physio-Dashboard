// components/exercises/ExerciseModal.tsx
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Exercise } from '@/lib/types';
import { useEffect } from 'react';
import { useCategoryStore } from '@/stores/useCategoryStore';

// Validation schema using Zod
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  category: z.string().min(1, 'Category is required.'),
  reps: z.string().min(1, 'Reps are required.'),
  sets: z.string().min(1, 'Sets are required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  tags: z.string().min(2, 'At least one tag is required.'),
  video: z.any().optional(),
  thumbnail: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: Exercise | null;
  isLoading: boolean;
}

export function ExerciseModal({ isOpen, onClose, onSubmit, initialData, isLoading }: ExerciseModalProps) {
  const { categories, fetchCategories } = useCategoryStore();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      reps: '',
      sets: '',
      description: '',
      tags: '',
    },
  });

  useEffect(() => {
    // Fetch categories when the modal is opened
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        category: initialData.category._id, // Set the ID for the select
        reps: initialData.reps,
        sets: initialData.sets,
        description: initialData.description,
        tags: initialData.tags.join(', '),
      });
    } else {
      form.reset({
        name: '',
        category: '',
        reps: '',
        sets: '',
        description: '',
        tags: '',
      });
    }
  }, [initialData, form, isOpen]);

  const handleFormSubmit: SubmitHandler<FormValues> = (values) => {
    const formData = new FormData();
    
    Object.keys(values).forEach(key => {
        const formKey = key as keyof FormValues;
        if (formKey === 'video' || formKey === 'thumbnail') {
            if (values[formKey] && values[formKey][0]) {
                formData.append(formKey, values[formKey][0]);
            }
        } else {
            formData.append(formKey, values[formKey]);
        }
    });

    if (initialData?._id) {
        formData.append('_id', initialData._id);
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="exercise-form" onSubmit={form.handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto pr-6 -mr-6 space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Exercise Name</FormLabel>
                <FormControl><Input placeholder="e.g., Glute Bridge" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat._id} value={cat._id}>{cat.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="reps" render={({ field }) => (
                <FormItem>
                  <FormLabel>Reps</FormLabel>
                  <FormControl><Input placeholder="e.g., 15" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="sets" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sets</FormLabel>
                  <FormControl><Input placeholder="e.g., 3" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Describe the exercise movement..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <FormField control={form.control} name="tags" render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormControl><Input placeholder="e.g., Phase 1, Core, Pilates" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField control={form.control} name="video" render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  <FormControl><Input type="file" accept="video/*" onChange={(e) => onChange(e.target.files)} {...rest} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <FormField control={form.control} name="thumbnail" render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl><Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...rest} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
            </div>
          </form>
        </Form>
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="exercise-form" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Exercise'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
