'use client';

import React, { useState, useTransition } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { aspectRatioOptions, defaultValues, transformationTypes } from '@/constants';
import { CustomField } from './CustomField';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils';
import { Button } from '../ui/button';
import { updateCredits } from '@/lib/actions/user.action';

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

export const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];

  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const [isPending, startTransition] = useTransition();

  const initialValues =
    data && action === 'Update'
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prevState) => ({
      ...prevState,
      aspectRation: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));
    setNewTransformation(transformationType.config);
    return onChangeField(value);
  };
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prevState) => ({
        ...prevState,
        [type]: { ...prevState?.[type], [fieldName === 'prompt' ? 'prompt' : 'to']: value },
      }));
    }, 1000);
    return onChangeField(value);
  };

  // TODO: Return to updateCredits
  const onTransformHandler = async () => {
    setIsTransforming(true);
    setTransformationConfig(deepMergeObjects(newTransformation, transformationConfig));
    setNewTransformation(null);
    startTransition(async () => {
      // await updateCredits(userId, creditFee)
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          render={({ field }) => <Input {...field} className="input-field" />}
        />
        {type === 'fill' && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect Ratio"
            className="w-full"
            render={({ field }) => (
              <Select onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}>
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
        {(type === 'remove' || type === 'recolor') && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={type === 'remove' ? 'Object to remove' : 'Object to recolor'}
              className="w-full"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={(e) => onInputChangeHandler('prompt', e.target.value, type, field.onChange)}
                  className="input-field"
                />
              )}
            />
            {type === 'recolor' && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement color"
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    onChange={(e) => onInputChangeHandler('color', e.target.value, 'recolor', field.onChange)}
                    className="input-field"
                  />
                )}
              />
            )}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <Button
            disabled={isTransforming || newTransformation === null}
            className="submit-button capitalize"
            type="button"
            onClick={onTransformHandler}
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>
          <Button disabled={isSubmitting} className="submit-button capitalize" type="submit">
            {isSubmitting ? 'Submitting...' : 'Save image'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
