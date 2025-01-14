import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, Modal, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { AddFeatureModalProps } from '../types'
import { THEME } from '../constants'
import { DEFAULT_LOCALE, WishFlow } from '../config'

export const AddFeatureModal: React.FC<AddFeatureModalProps> = ({ isVisible, onClose, onSubmit }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      email: email.trim() || undefined,
      locale: WishFlow.config.locale || DEFAULT_LOCALE,
      userId: WishFlow.config.userInfo?.userId || '',
    })

    setTitle('')
    setDescription('')
    setEmail('')
    onClose()
  }

  return (
    <Modal visible={isVisible} animationType='slide' transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={WishFlow.config?.styles?.AddFeatureModal?.modalContainer}>
        <View style={[WishFlow.config?.styles?.AddFeatureModal?.content]}>
          <>
            <TextInput
              style={[WishFlow.config?.styles?.AddFeatureModal?.input]}
              placeholder='Title'
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <TextInput
              style={[
                WishFlow.config?.styles?.AddFeatureModal?.input,
                WishFlow.config?.styles?.AddFeatureModal?.textArea,
              ]}
              placeholder='Description'
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <TextInput
              style={[WishFlow.config?.styles?.AddFeatureModal?.input]}
              placeholder='Email (optional)'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </>

          <View style={WishFlow.config?.styles?.AddFeatureModal?.buttons}>
            <Pressable
              style={[
                WishFlow.config?.styles?.AddFeatureModal?.button,
                WishFlow.config?.styles?.AddFeatureModal?.cancelButton,
              ]}
              onPress={onClose}>
              <Text
                style={[
                  WishFlow.config?.styles?.AddFeatureModal?.buttonText,
                  WishFlow.config?.styles?.AddFeatureModal?.cancelButtonText,
                ]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              style={[
                WishFlow.config?.styles?.AddFeatureModal?.button,
                WishFlow.config?.styles?.AddFeatureModal?.submitButton,
              ]}
              onPress={handleSubmit}
              disabled={!title.trim() || !description.trim()}>
              <Text style={[WishFlow.config?.styles?.AddFeatureModal?.buttonText]}>Submit</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export const defaultStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: THEME.BACKGROUND_COLOR,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
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
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: THEME.TEXT_COLOR,
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
    backgroundColor: '#ddd',
  },
  cancelButtonText: {
    color: '#FF0000',
  },
  submitButton: {
    backgroundColor: THEME.PRIMARY_COLOR,
  },
  buttonText: {
    color: THEME.TEXT_COLOR,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
})
