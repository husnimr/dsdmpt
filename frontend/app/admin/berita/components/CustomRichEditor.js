"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link as LinkIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Trash2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify
} from 'lucide-react';

export default function CustomRichEditor({ value, onChange }) {
  const iframeRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 15px;
            line-height: 1.6;
            color: #334155;
            padding: 15px;
            margin: 0;
            background: #ffffff;
            min-height: 400px;
            box-sizing: border-box;
            outline: none;
          }
          p { margin: 0 0 1em 0; }
          ul, ol { margin: 0 0 1em 0; padding-left: 20px; }
          blockquote {
            border-left: 4px solid #FFC72C;
            padding-left: 15px;
            margin: 0 0 1em 0;
            color: #475569;
            font-style: italic;
            background: #FFFDF5;
            padding: 8px 15px;
          }
          h1, h2, h3 { margin: 0 0 0.5em 0; font-weight: 700; color: #1e293b; }
          h1 { font-size: 1.8rem; }
          h2 { font-size: 1.5rem; }
          h3 { font-size: 1.2rem; }
          a { color: #3b82f6; text-decoration: underline; }
          img { max-width: 100%; height: auto; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body contenteditable="true">
        ${value || '<p><br></p>'}
      </body>
      </html>
    `);
    doc.close();
    setLoaded(true);

    const handleUpdate = () => {
      onChange(doc.body.innerHTML);
    };

    doc.body.addEventListener('input', handleUpdate);
    doc.body.addEventListener('blur', handleUpdate);

    return () => {
      if (doc && doc.body) {
        doc.body.removeEventListener('input', handleUpdate);
        doc.body.removeEventListener('blur', handleUpdate);
      }
    };
  }, []);

  // Update editor content when external value changes (but only if it differs from current innerHTML to prevent cursor jumping)
  useEffect(() => {
    if (!loaded) return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (doc && doc.body && doc.body.innerHTML !== value) {
      // only update if iframe is not active document to prevent typing cursor loss
      if (document.activeElement !== iframe) {
        doc.body.innerHTML = value || '<p><br></p>';
      }
    }
  }, [value, loaded]);

  const runCommand = (cmd, arg = null) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const win = iframe.contentWindow;
    win.focus();
    win.document.execCommand(cmd, false, arg);
    onChange(win.document.body.innerHTML);
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL Link:');
    if (url) {
      runCommand('createLink', url);
    }
  };



  return (
    <div style={{ border: '1px solid #CBD5E1', borderRadius: '6px', overflow: 'hidden', background: '#FFFFFF' }}>
      <div style={{ 
        display: 'flex', 
        gap: '0.25rem', 
        flexWrap: 'wrap', 
        background: '#F8FAFC', 
        borderBottom: '1px solid #CBD5E1', 
        padding: '0.5rem',
        alignItems: 'center'
      }}>
        <button type="button" onClick={() => runCommand('bold')} title="Tebal (Bold)" style={btnStyle}><Bold size={15} /></button>
        <button type="button" onClick={() => runCommand('italic')} title="Miring (Italic)" style={btnStyle}><Italic size={15} /></button>
        <button type="button" onClick={() => runCommand('underline')} title="Garis Bawah (Underline)" style={btnStyle}><Underline size={15} /></button>
        
        <span style={{ width: '1px', height: '18px', background: '#CBD5E1', margin: '0 0.25rem' }} />
        
        <button type="button" onClick={() => runCommand('justifyLeft')} title="Rata Kiri" style={btnStyle}><AlignLeft size={15} /></button>
        <button type="button" onClick={() => runCommand('justifyCenter')} title="Rata Tengah" style={btnStyle}><AlignCenter size={15} /></button>
        <button type="button" onClick={() => runCommand('justifyRight')} title="Rata Kanan" style={btnStyle}><AlignRight size={15} /></button>
        <button type="button" onClick={() => runCommand('justifyFull')} title="Rata Kiri Kanan" style={btnStyle}><AlignJustify size={15} /></button>

        <span style={{ width: '1px', height: '18px', background: '#CBD5E1', margin: '0 0.25rem' }} />

        <button type="button" onClick={() => runCommand('insertUnorderedList')} title="Daftar Bulat" style={btnStyle}><List size={15} /></button>
        <button type="button" onClick={() => runCommand('insertOrderedList')} title="Daftar Angka" style={btnStyle}><ListOrdered size={15} /></button>
        
        <span style={{ width: '1px', height: '18px', background: '#CBD5E1', margin: '0 0.25rem' }} />

        <button type="button" onClick={() => runCommand('formatBlock', 'h1')} title="Heading 1" style={btnStyle}><Heading1 size={15} /></button>
        <button type="button" onClick={() => runCommand('formatBlock', 'h2')} title="Heading 2" style={btnStyle}><Heading2 size={15} /></button>
        <button type="button" onClick={() => runCommand('formatBlock', 'h3')} title="Heading 3" style={btnStyle}><Heading3 size={15} /></button>

        <span style={{ width: '1px', height: '18px', background: '#CBD5E1', margin: '0 0.25rem' }} />

        <button type="button" onClick={insertLink} title="Sisipkan Link" style={btnStyle}><LinkIcon size={15} /></button>
      </div>

      <iframe 
        ref={iframeRef} 
        style={{ 
          width: '100%', 
          height: '450px', 
          border: 'none', 
          display: 'block',
          background: '#ffffff'
        }}
      />
    </div>
  );
}

const btnStyle = {
  padding: '0.4rem 0.5rem',
  background: '#ffffff',
  border: '1px solid #E2E8F0',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#475569',
  transition: 'all 0.2s',
  outline: 'none'
};
