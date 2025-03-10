import React from 'react'
import { View, Text, TextInput, Pressable, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { AddFeatureModalProps } from '../types'
import { WishFlow } from '../config'
import { Theme } from '../types'

type FormData = {
  title: string
  description: string
  email: string
}

export const AddFeatureModal: React.FC<AddFeatureModalProps> = ({ isVisible, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      email: WishFlow.config.userInfo?.email || '',
    },
  })

  const onSubmitForm = (data: FormData) => {
    if (!WishFlow.config.userInfo?.userId) {
      throw new Error('User info is not set')
    }

    onSubmit(
      {
        title: data.title,
        description: data.description,
      },
      {
        userId: WishFlow.config.userInfo.userId,
        email: data.email || WishFlow.config.userInfo.email,
        locale: WishFlow.config.userInfo.locale,
      },
    )
    reset()
    onClose()
  }

  return (
    <Modal visible={isVisible} animationType='slide' onRequestClose={onClose} transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={WishFlow.config.styles.AddFeatureModal.modalContainer}>
        <View style={WishFlow.config.styles.AddFeatureModal.content}>
          <Controller
            control={control}
            name='title'
            rules={{
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters',
              },
              maxLength: {
                value: 30,
                message: 'Title must be less than 30 characters',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[
                    WishFlow.config.styles.AddFeatureModal.input,
                    errors.title && WishFlow.config.styles.AddFeatureModal.inputError,
                  ]}
                  placeholder='Title'
                  value={value}
                  onChangeText={onChange}
                  maxLength={30}
                />
                {errors.title && (
                  <Text style={WishFlow.config.styles.AddFeatureModal.errorText}>{errors.title.message}</Text>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name='description'
            rules={{
              required: 'Description is required',
              minLength: {
                value: 30,
                message: 'Description must be at least 10 characters',
              },
              maxLength: {
                value: 300,
                message: 'Description must be less than 300 characters',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[
                    WishFlow.config.styles.AddFeatureModal.input,
                    WishFlow.config.styles.AddFeatureModal.textArea,
                    errors.description && WishFlow.config.styles.AddFeatureModal.inputError,
                  ]}
                  placeholder='Description'
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
                />
                {errors.description && (
                  <Text style={WishFlow.config.styles.AddFeatureModal.errorText}>{errors.description.message}</Text>
                )}
              </>
            )}
          />

          <Controller
            control={control}
            name='email'
            rules={{
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email format',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={[
                    WishFlow.config.styles.AddFeatureModal.input,
                    errors.email && WishFlow.config.styles.AddFeatureModal.inputError,
                  ]}
                  placeholder='Email (optional)'
                  value={value}
                  onChangeText={onChange}
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
                {errors.email && (
                  <Text style={WishFlow.config.styles.AddFeatureModal.errorText}>{errors.email.message}</Text>
                )}
              </>
            )}
          />

          <View style={WishFlow.config.styles.AddFeatureModal.buttons}>
            <Pressable
              style={[
                WishFlow.config.styles.AddFeatureModal.button,
                WishFlow.config.styles.AddFeatureModal.cancelButton,
              ]}
              onPress={onClose}>
              <Text
                style={[
                  WishFlow.config.styles.AddFeatureModal.buttonText,
                  WishFlow.config.styles.AddFeatureModal.cancelButtonText,
                ]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[
                WishFlow.config.styles.AddFeatureModal.button,
                WishFlow.config.styles.AddFeatureModal.submitButton,
              ]}
              onPress={handleSubmit(onSubmitForm)}>
              <Text style={WishFlow.config.styles.AddFeatureModal.buttonText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export const createAddFeatureModalStyles = (theme: Theme) => {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.overlay,
    },
    content: {
      backgroundColor: theme.background,
      margin: 20,
      borderRadius: 12,
      padding: 20,
      shadowColor: theme.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
      color: theme.text,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 8,
    },
    cancelButton: {
      backgroundColor: theme.card,
    },
    cancelButtonText: {
      color: theme.secondary,
    },
    submitButton: {
      backgroundColor: theme.primary,
    },
    buttonText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
    inputError: {
      borderColor: theme.error || '#ff0000',
    },
    errorText: {
      color: theme.error || '#ff0000',
      fontSize: 12,
      marginTop: -12,
      marginBottom: 12,
      marginLeft: 4,
    },
  })
}
