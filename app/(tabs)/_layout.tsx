import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: '#f5f5f5 ' },
      headerShadowVisible: false,
      tabBarStyle: {
        backgroundColor: '#f5f5f5',
        borderTopColor: '#f5f5f5',
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
      },
      tabBarActiveTintColor: '#8130ceff',
      tabBarInactiveTintColor: '#999999',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Today's Habbits",
          tabBarIcon: ({ color, size, focused }) => {
            return <MaterialCommunityIcons name={focused ? "home" : "home-outline"} color={color} size={size} />
          }
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          title: "Streaks",
          tabBarIcon: ({ color, size }) =>
            <MaterialCommunityIcons name="chart-arc" color={color} size={size} />
        }} />

        <Tabs.Screen
        name="add-task"
        options={{
          title: "Add Task",
          tabBarIcon: ({ color, size }) =>
            <MaterialCommunityIcons name="plus-circle" color={color} size={size} />
        }} />
    </Tabs>
    
  );
}