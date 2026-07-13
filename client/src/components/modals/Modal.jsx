import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import clsx from 'clsx';

const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={clsx(
              'relative z-10 w-full rounded-2xl bg-white shadow-card dark:bg-ink-light max-h-[90vh] overflow-y-auto',
              sizes[size]
            )}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-white/95 px-6 py-4 backdrop-blur dark:border-white/10 dark:bg-ink-light/95">
              <h3 className="font-display text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="focus-ring rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
