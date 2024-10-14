

const Loading : React.FC = ()=> {
  return (    
    <div className="d-flex justify-content-center mt-4">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="sr-only ms-4">Loading...</span>
    </div>
  );
}

export default Loading;
