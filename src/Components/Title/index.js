import './Title.css';

export default function Title({children, titleName}){
    return (
        <div className="title">
            {children}
            <span>{titleName}</span>
        </div>
    )
}