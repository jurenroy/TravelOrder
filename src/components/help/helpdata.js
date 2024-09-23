import Dashboard from '@/components/help/helpimages/dashboard.PNG'
import Edit from '@/components/help/helpimages/edit.PNG'
import TravelForm from '@/components/help/helpimages/form.PNG'
import SampDashboard from '@/components/help/helpimages/samp.PNG'
import SCDashboard from '@/components/help/helpimages/sec_dash.PNG'
import PODashboard from '@/components/help/helpimages/po_dash.PNG'
import DCDashboard from '@/components/help/helpimages/recommend_dash.PNG'
import RDDashboard from '@/components/help/helpimages/rd_dash.PNG'

export const helpData = {
    // admin: [
    //   {
    //     title: 'Admin Overview',
    //     content: 'Here is the overview for admin users.',
    //     image: 'admin-overview.jpg'
    //   },
    //   {
    //     title: 'Admin Settings',
    //     content: 'Instructions for admin settings.',
    //     image: travelDashboard
    //   }
    // ],
    user: [
      {
        title: 'Dashboard',
        content: 'This is the starting empty Dashboard Page.',
        image: Dashboard
      },
      {
        title: 'Edit Password Page',
        content: 'This is the Edit page to Change Password',
        image: Edit
      },
      {
        title: 'Add Travel Order',
        content: 'This is the page to add Travel Order. Those having an arrow are required',
        image: TravelForm
      },
      {
        title: 'Dashboard with Travel Order',
        content: 'This is the Dashboard after adding a Travel Order',
        image: SampDashboard
      },
      {
        title: 'Account Special Feature (Section Chief)',
        content: 'This is the Dashboard for Section Cheifs to add initial into a Travel Order',
        image: SCDashboard
      },
      {
        title: 'Account Special Feature (Planning Officer)',
        content: 'This is the Dashboard for Planning Officer to add note into a Travel Order',
        image: PODashboard
      },
      {
        title: 'Account Special Feature (Division Chief)',
        content: 'This is the Dashboard for Division Chief to add note and Recommend a Travel Order',
        image: DCDashboard
      },
      {
        title: 'Account Special Feature (OIC or RD)',
        content: 'This is the Dashboard for OIC or Regional Director to add note and Approve a Travel Order',
        image: RDDashboard
      },
    ],
  };
  