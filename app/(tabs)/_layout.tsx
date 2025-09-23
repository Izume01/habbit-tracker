import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from "expo-router";
import { useTheme } from 'react-native-paper';

export default function TabsLayout() {
  const theme = useTheme();
  
  return (
    <Tabs screenOptions={{
      headerStyle: { 
        backgroundColor: theme.colors.surface,
        borderBottomColor: theme.colors.outline,
        borderBottomWidth: 0.5,
      },
      headerTitleStyle: {
        color: theme.colors.onSurface,
        fontWeight: '600',
      },
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.outline,
        borderTopWidth: 0.5,
        elevation: 0,
        shadowOpacity: 0,
        height: 60,
      },
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habits",
          tabBarIcon: ({ color, size, focused }) => {
            return <MaterialCommunityIcons name={focused ? "home" : "home-outline"} color={color} size={size} />
          }
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",
          tabBarIcon: ({ color, size, focused }) =>
            <MaterialCommunityIcons name={"chart-line"} color={color} size={size} />
        }} />

        <Tabs.Screen
        name="add-task"
        options={{
          title: "Add Task",
          tabBarIcon: ({ color, size, focused }) =>
            <MaterialCommunityIcons name={focused ? "plus-circle" : "plus-circle-outline"} color={color} size={size} />
        }} />
    </Tabs>
    
  );
}