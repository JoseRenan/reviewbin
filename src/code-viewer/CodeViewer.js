import React, { useState } from 'react';
import code from './code';
import ReactMde from 'react-mde';
import { Remarkable } from 'remarkable';
import './CodeViewer.css';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { CodeViewer as ReactCodeViewer } from 'react-extensible-code-viewer';
import 'react-extensible-code-viewer/dist/index.css';
import { Button } from '../button/Button';

const md = new Remarkable();

const AddCommentButton = ({ onClick, hide }) =>
  !hide && (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white px-2 rounded font-bold"
      onClick={onClick}>
      +
    </button>
  );

const CommentInput = ({ onSubmit, onCancel }) => {
  const [value, setValue] = useState('');
  const [selectedTab, setSelectedTab] = useState('write');
  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };
  return (
    <>
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(md.render(markdown))
        }
      />
      <div class="flex -mx-1 justify-end mt-2">
        <div class="px-1">
          <Button type="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <div class="px-1">
          <Button onClick={handleSubmit}>Comment</Button>
        </div>
      </div>
    </>
  );
};

const CommentArea = ({ onCancel }) => {
  const [comments, setComments] = useState([]);
  return (
    <div className="border-t border-b border-solid p-2 my-1 font-sans">
      {comments.map((comment) => (
        <div dangerouslySetInnerHTML={{ __html: md.render(comment) }} />
      ))}
      <CommentInput
        onCancel={onCancel}
        onSubmit={(comment) => setComments([...comments, comment])}
      />
    </div>
  );
};

const CodeLine = ({ lineNumber, children }) => {
  const [showAddComment, setShowAddComment] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  return (
    <>
      <span
        className="flex"
        onMouseEnter={() => setShowAddComment(true)}
        onMouseLeave={() => setShowAddComment(false)}>
        <span className="w-12 text-right text-gray-500">{lineNumber}.</span>
        <div className="flex w-10 justify-center">
          <AddCommentButton
            hide={!showAddComment}
            onClick={() => setShowCommentInput(true)}
          />
        </div>
        {children}
      </span>
      {showCommentInput && (
        <CommentArea onCancel={() => setShowCommentInput(false)} />
      )}
    </>
  );
};

export const CodeViewer = () => (
  <ReactCodeViewer
    code={code}
    language="java"
    line={(props) => <CodeLine {...props} />}
  />
);
