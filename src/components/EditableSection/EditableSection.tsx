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
    if (isEditing) return '#01579B';
    if (isEmpty) return '#B80C0C';
    return '#fff';
  };

  const getBoxShadow = () => {
    if (isEditing) return '0px 0px 24px 0px rgba(1, 87, 155, 0.25)';
    if (isEmpty) return '0px 0px 24px 0px rgba(184, 12, 12, 0.25)';
    return '0px 0px 24px 0px rgba(0, 0, 0, 0.25)';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        px: '32px',
        py: '24px',
        border: 1,
        borderColor: getBorderColor(),
        boxShadow: getBoxShadow(),
        borderRadius: 1,
        position: 'relative',
        width: '100%',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h3" component="h3">
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