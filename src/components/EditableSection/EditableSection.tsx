import React from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface EditableSectionProps {
  title: string;
  isEditing: boolean;
  isEmpty: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

function EditableSection({title, isEditing, isEmpty, onEdit, onSave, onCancel, children}: EditableSectionProps) {
  const getBorderColor = () => {
    if (isEditing) return '#1976d2';
    if (isEmpty) return '#f44336';
    return '#e0e0e0';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: 2,
        borderColor: getBorderColor(),
        borderRadius: 2,
        position: 'relative',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Box>
          {isEditing ? (
            <>
              <IconButton onClick={onSave} color="success" size="small">
                <CheckIcon />
              </IconButton>
              <IconButton onClick={onCancel} color="error" size="small">
                <CloseIcon />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={onEdit} size="small">
              <EditIcon />
            </IconButton>
          )}
        </Box>
      </Box>
      {children}
    </Paper>
  );
};

export default EditableSection;