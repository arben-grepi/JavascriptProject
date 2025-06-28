# Project Planning Tool - Advanced Student Group Management System

A sophisticated web application designed for educational institutions to intelligently divide students into project groups based on multiple criteria and preferences. This tool demonstrates advanced JavaScript development, data processing, and user experience design.

**Live Demo:** [ryhmiin.guidesoft.fi](https://ryhmiin.guidesoft.fi/)

## 🚀 Advanced Features & Technical Capabilities

### **Intelligent Grouping Algorithm**

- **Multi-criteria Grouping**: Implements sophisticated algorithms that consider student preferences, class distribution, and project role requirements
- **Dynamic Group Size Optimization**: Smart calculation of optimal group sizes with minimum size constraints
- **Fisher-Yates Shuffle Implementation**: Ensures truly random distribution while maintaining grouping criteria
- **Segmentation & Ordering Logic**: Advanced data processing that segments students by attributes and orders groups by size for optimal distribution

### **Advanced Data Processing**

- **Excel Integration with XLSX Library**: Robust parsing and processing of complex Excel datasets
- **Real-time Data Comparison**: Side-by-side comparison of different student datasets for informed decision-making
- **Dynamic JSON Schema Conversion**: Automatic conversion of Excel data to structured JSON format
- **Multi-file Processing**: Simultaneous handling of enrollment data and course preference files

### **Sophisticated User Interface**

- **Drag & Drop File Upload**: Modern file handling with visual feedback and validation
- **Dynamic Table Generation**: Real-time creation of responsive data tables with sorting capabilities
- **Advanced Filtering System**: Multi-column search with real-time highlighting and table visibility management
- **Interactive Group Management**: Visual group creation with size controls and distribution options

### **State Management Architecture**

- **Custom AppState Class**: Centralized state management for complex application data
- **Reactive UI Updates**: Automatic interface updates based on state changes
- **Memory Management**: Efficient cleanup and resource management for large datasets

### **Advanced Sorting & Filtering**

- **Multi-dimensional Sorting**: Complex sorting algorithms that handle multiple criteria simultaneously
- **Real-time Search**: Instant filtering with visual feedback and smart table hiding/showing
- **Column-based Filtering**: Advanced filtering system that works across multiple data columns
- **Dynamic Selector Management**: Intelligent dropdown population based on data structure

## 🛠 Technical Stack & Architecture

### **Frontend Technologies**

- **Vanilla JavaScript (ES6+)**: Modern JavaScript with modules, classes, and advanced features
- **HTML5/CSS3**: Semantic markup with responsive design principles
- **Bootstrap Framework**: Professional UI components and responsive grid system
- **Modular Architecture**: Well-structured component-based code organization

### **Backend Infrastructure**

- **Node.js/Express.js**: RESTful API server with static file serving
- **Nodemon**: Development workflow optimization with hot reloading
- **Production-ready Deployment**: Environment variable configuration and port management

### **Data Processing & Libraries**

- **XLSX Library**: Advanced Excel file parsing and manipulation
- **Custom Data Processing**: Sophisticated algorithms for student data analysis
- **JSON Schema Management**: Dynamic data structure handling

## 📁 Project Structure

```
JavascriptProject/
├── frontend/
│   ├── components/
│   │   ├── app.js              # Main application logic (518 lines)
│   │   ├── AppState.js         # State management system
│   │   ├── sorter.js           # Advanced grouping algorithms
│   │   ├── filtering.js        # Real-time search & filtering
│   │   ├── tableWriter.js      # Dynamic table generation
│   │   ├── groupTableBuilder.js # Group visualization
│   │   ├── fileComparer.js     # Data comparison logic
│   │   └── excel.js            # Excel processing utilities
│   ├── assets/                 # CSS, images, and static resources
│   └── index.html              # Main application interface
├── backend/
│   └── server.js               # Express.js server
└── Testidata/                  # Sample Excel datasets
```

## 🎯 Key Technical Achievements

- **Complex Algorithm Implementation**: Developed sophisticated grouping algorithms that handle multiple constraints
- **Real-time Data Processing**: Built efficient systems for processing large Excel datasets in the browser
- **Advanced UI/UX Design**: Created intuitive interfaces for complex data manipulation tasks
- **Modular Code Architecture**: Implemented maintainable, scalable code structure with clear separation of concerns
- **Performance Optimization**: Efficient handling of large datasets with minimal memory footprint

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/arben-grepi/JavascriptProject.git
   cd JavascriptProject
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Access the application**
   - Open `http://localhost:3000` in your browser
   - Upload Excel files with student data
   - Configure grouping criteria and generate optimized groups

## 📊 Sample Data

The project includes sample Excel files in the `Testidata/` directory for testing:

- `Belbin.xlsx` - Team role assessment data
- `OpiskelijatPepistä.xlsx` - Student enrollment data
- `Scrum.xlsx` - Agile methodology preferences

This project demonstrates advanced JavaScript development skills, complex algorithm implementation, and the ability to create sophisticated web applications that solve real-world problems in educational technology.
