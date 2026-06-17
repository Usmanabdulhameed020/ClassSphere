import React from 'react';
import OverviewPage from '../pages/OverviewPage';
import StatsOverview from '../pages/StatsOverview';
import CalendarPage from '../pages/CalendarPage';
import AssignmentsPage from '../pages/AssignmentsPage';
import MaterialsPage from '../pages/MaterialsPage';
import MessagesPage from '../pages/MessagesPage';
import SettingsPage from '../pages/SettingsPage';
import ClassroomView from '../pages/ClassroomView';
import ActivityPage from '../pages/ActivityPage';

export default function DashboardRenderer({ 
  activeTab, 
  selectedClass, 
  user, 
  classes, 
  stats, 
  onSelectClass, 
  onBackToDashboard,
  onTabChange
}) {
  // 1. If a class is selected, show the specific Classroom View
  if (selectedClass) {
    return (
      <ClassroomView 
        classData={selectedClass} 
        onBack={onBackToDashboard} 
        user={user} 
      />
    );
  }

  // 2. Otherwise, render the page based on the active sidebar tab
  switch (activeTab) {
    case 'Home':
      return <OverviewPage classes={classes} onSelectClass={onSelectClass} />;
    
    case 'Calendar':
      return <CalendarPage />;
    
    case 'Assignments':
      return <AssignmentsPage />;
    
    case 'Materials':
      return <MaterialsPage />;
    
    case 'Messages':
      return <MessagesPage />;
    
    case 'Activity':
      return <ActivityPage />;
    
    case 'Settings':
      return <SettingsPage user={user} />;
    
    default:
      return <OverviewPage classes={classes} onSelectClass={onSelectClass} />;
  }
}
