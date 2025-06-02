import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Trash2 } from "lucide-react";

const FeedbackTable = ({ feedbacks = [], onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S/L</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedbacks.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              No results
            </TableCell>
          </TableRow>
        ) : (
          feedbacks.map((feedback, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {feedback.avatar && (
                  <img 
                    src={feedback.avatar} 
                    alt={feedback.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </TableCell>
              <TableCell>{feedback.name}</TableCell>
              <TableCell>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDelete?.(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default FeedbackTable; 