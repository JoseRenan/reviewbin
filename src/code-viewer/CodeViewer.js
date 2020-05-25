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

const CommentInput = ({ onSubmit, onCancel, focused = false, profilePic }) => {
  const [value, setValue] = useState('');
  const [selectedTab, setSelectedTab] = useState('write');
  const [showTiny, setShowTiny] = useState(!focused);
  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
    setShowTiny(true);
  };
  if (showTiny) {
    return (
      <div className="flex border border-solid p-4">
        <img
          className="w-8 h-8 mr-4 rounded"
          src="https://www.learning.uclg.org/sites/default/files/styles/featured_home_left/public/no-user-image-square.jpg?itok=PANMBJF-"
          alt="user"
        />
        <input
          onFocus={() => setShowTiny(false)}
          className="w-full h-8 px-4 bg-white border border-solid focus:shadow-outline rounded"
          placeholder="Adicionar comentário"
        />
      </div>
    );
  }
  return (
    <div className="border border-solid p-4">
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        l18n={{ write: 'Comentário', preview: 'Pré-visualização' }}
        classes={{
          preview: 'markdown',
          toolbar: 'bg-gray-100',
          textArea: 'bg-white',
        }}
        generateMarkdownPreview={(markdown) =>
          Promise.resolve(md.render(markdown))
        }
      />
      <div class="flex -mx-2 justify-end mt-4">
        <div class="px-2">
          <Button
            type="secondary"
            onClick={!focused ? () => setShowTiny(true) : onCancel}>
            Cancelar
          </Button>
        </div>
        <div class="px-2">
          <Button onClick={handleSubmit}>Comentar</Button>
        </div>
      </div>
    </div>
  );
};

const Comment = ({ markdown }) => (
  <div className="flex border border-solid border-b-0 px-4 pt-4">
    <img
      className="w-8 h-8 mr-4 rounded"
      src="https://www.learning.uclg.org/sites/default/files/styles/featured_home_left/public/no-user-image-square.jpg?itok=PANMBJF-"
      alt="user"
    />
    <div className="w-full">
      <div className="flex">
        <span className="font-bold mr-4">José Renan</span>
        <span className="mr-10">Monitor</span>
      </div>
      <div
        className="mde-preview markdown"
        dangerouslySetInnerHTML={{ __html: md.render(markdown) }}
      />
    </div>
  </div>
);

const CommentArea = ({ onCancel }) => {
  const [comments, setComments] = useState([
    'Made the changes - ready for a new review :eyes: **@lex111**\n\nCan you please see?\n```\nsudo apt install reviewbin\n```',
  ]);
  return (
    <div className="border-t border-b border-solid p-4 my-1 font-sans">
      {comments.map((comment) => (
        <Comment markdown={comment} />
      ))}
      <CommentInput
        onCancel={() => true}
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

export const CodeViewer = () => {
  const [comments, setComments] = useState([
    'Made the changes - ready for a new review :eyes: **@lex111**\n\nCan you please see?\n```\nsudo apt install reviewbin\n```',
  ]);
  return (
    <>
      <ReactCodeViewer
        code={code}
        language="java"
        line={(props) => <CodeLine {...props} />}
      />
    </>
  );
};
