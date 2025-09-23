import { useAuthStore } from '@/store/useStore'
import { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'

export default function AuthScreen() {
  const { loading, error, login, register } = useAuthStore()
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [localError, setLocalError] = useState<string>('')

  const theme = useTheme()
  const styles = makeStyles(theme)

  // Clear local error when store error changes
  useEffect(() => {
    if (error) {
      setLocalError(error)
    }
  }, [error])

  const checkEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim())
  }

  const checkPassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character'
    }
    return null
  }

  const handleSwitchMode = () => {
    setIsSignUp(!isSignUp)
    setLocalError('')
    setEmail('')
    setPassword('')
  }

  const handleAuth = async () => {
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      setLocalError('Please fill in all fields')
      return
    }

    if (!checkEmail(trimmedEmail)) {
      setLocalError('Invalid email address')
      return
    }

    const passwordError = checkPassword(trimmedPassword)
    if (passwordError) {
      setLocalError(passwordError)
      return
    }

    setLocalError('')

    try {
      if (isSignUp) {
        await register(trimmedEmail, trimmedPassword)
      } else {
        await login(trimmedEmail, trimmedPassword)
      }

      // router.replace is handled by RouteGuard in _layout.tsx
    } catch (err: any) {
      setLocalError(
        err.message || (isSignUp ? 'Registration failed' : 'Login failed')
      )
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineSmall">
          {isSignUp ? 'Create an account' : 'Sign in to your account'}
        </Text>

        <TextInput
          label="Email"
          placeholder="example@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          error={!!localError} // must be boolean
        />

        <TextInput
          label="Password"
          placeholder="Enter password"
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          error={!!localError} // must be boolean
        />

        {localError && <Text style={styles.error}>{localError}</Text>}

        <Button
          style={styles.button}
          mode="contained"
          onPress={handleAuth}
          loading={loading}
          disabled={loading}
        >
          <Text>
            {loading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Sign in'}
          </Text>
        </Button>

        <Button
          style={styles.switchModeButton}
          mode="text"
          onPress={handleSwitchMode}
        >
          <Text>
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

const makeStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      marginBottom: 16,
    },
    button: {
      marginTop: 8,
    },
    switchModeButton: {
      marginTop: 16,
    },
    error: {
      color: theme.colors.error,
      marginTop: 8,
    },
  })