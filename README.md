Homework Assignment #1: Modification of Channels & Useful Libraries
Information Visualization (CS 5970), Spring 2025


Technical Stack: For this project, I utilized React as the primary JavaScript library for building the user interface. Additionally, I employed Next.js as the framework to enhance the development experience and optimize rendering. To style the application, I used Tailwind CSS, a CSS framework that provides flexibility and efficiency in designing UI components. For data visualization, I have used d3 js, a powerful library for manipulating documents based on data and creating interactive visualizations.

Implementation Details:
1.	Component Structure: I have created a component named ScatterPlot. It is implemented as a functional React component in the Next.js Framework. It accepts a dataset as a prop and renders an SVG-based scatter plot.
2.	State Management: The component maintains state using React’s useState hook to manage the selected attribute mappings for X-axis, Y-axis, color, opacity, and size. Another state variable stores the data points selected via brushing interaction.
3.	D3 Integration: The D3 library is used to create linear scales for mapping data values to pixel positions. The scatter plot includes axes, circles representing data points, and interactive brushing functionality.
4.	Brush Selection: Users can select a portion of the scatter plot using d3’s brush functionality. The selected data points are captured and displayed in a table below the scatter plot and control panel.
5.	Control Panel: A control panel allows users to dynamically change the axis mappings and other visual properties. The available attributes are extracted from the dataset and presented as dropdown options. 
